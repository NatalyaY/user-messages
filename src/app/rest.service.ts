import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject, Subscription, tap, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

export interface Message {
    id: number,
    username: string,
    datetime: number,
    message: string
}

export type PostMessage = Omit<Message, 'id'>

export type pagination = ReturnType<typeof getPaginationFromHeader> | null;

function parsePaginationFromHeader(header: string) {
    const pagination = header.split(', ')
        .map(link => link.split('; '))
        .reduce((acc, [link, rel]) => {
            const params = new URLSearchParams(link.split('?')[1].slice(0, -1));
            const paramsObject = {
                _page: Number(params.get('_page')),
                ...(params.get('_limit') ? { _limit: Number(params.get('_limit')) } : {})
            };
            const relValue = rel.replace(/"/g, '').replace('rel=', '');
            acc[relValue] = { params: paramsObject, active: false };
            return acc;
        }, {} as { [key: string]: { params: { _page: number, _limit?: number }, active: boolean } });

    if (!pagination['prev']) {
        pagination['first'].active = true;
    } else if (pagination['next']) {
        pagination['current'] = {
            params: {
                ...pagination['next']['params'],
                _page: +pagination['next']['params']['_page'] - 1
            },
            active: true
        };
    } else {
        pagination['last'].active = true;
    }

    if (pagination['prev'] && pagination['prev']['params']['_page'] == pagination['first']['params']['_page']) {
        delete pagination['prev'];
    }

    if (pagination['next'] && pagination['next']['params']['_page'] == pagination['last']['params']['_page']) {
        delete pagination['next'];
    }

    return pagination;
}

function getPaginationFromHeader(header: string | null) {
    if (!header) return null;

    const pagination = parsePaginationFromHeader(header);

    const divider = { params: { _page: '...', _limit: pagination['first'].params._limit }, active: false };
    const paginationPages = [
        pagination['first'],
        ...(pagination['prev'] ? [divider, pagination['prev']] : []),
        ...(pagination['current'] ? [pagination['current']] : []),
        ...(pagination['next'] ? [pagination['next'], divider] : []),
        pagination['last']
    ];

    if (Object.keys(pagination).length < 5) {
        if (!pagination['prev'] && !pagination['current']) {
            paginationPages.splice(2, 0,
                { ...divider, params: { ...divider.params, _page: 3 } },
                { ...divider, params: { ...divider.params, _page: 4 } },
                { ...divider, params: { ...divider.params, _page: 5 } },
            );
        } else if (pagination['next']) {
            paginationPages.splice(3, 0,
                { ...divider, params: { ...divider.params, _page: 4 } },
                { ...divider, params: { ...divider.params, _page: 5 } },
            );
        } else {
            paginationPages.splice(2, 0,
                { ...divider, params: { ...divider.params, _page: pagination['prev'].params._page - 2 } },
                { ...divider, params: { ...divider.params, _page: pagination['prev'].params._page - 1 } },
            );
            if (!pagination['current']) {
                paginationPages.splice(2, 0,
                    { ...divider, params: { ...divider.params, _page: pagination['prev'].params._page - 3 } },
                );
            }
        }
    }
    return paginationPages;
}

@Injectable({
    providedIn: 'root'
})
export class RestService {

    messages$ = new BehaviorSubject<Message[]>([]);
    messagesLoading$ = new Subject<boolean>();

    pagination$ = new Subject<pagination>();
    defaultLimit = 10;
    private paginationParams: pagination = null;
    private subscription$?: Subscription;
    private timer?: number;
    private gotoLastPage?: boolean;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    getActualMessages = () => {
        this.messagesLoading$.next(true);

        if (!this.route.component && !this.subscription$) {
            this.subscription$ = this.route.queryParams.subscribe(() => {
                if (this.timer) return;
                this.timer = window.setTimeout(() => {
                    clearTimeout(this.timer);
                    this.subscription$?.unsubscribe();
                    this.subscription$ = undefined;
                    this.getActualMessages();
                });
            });
            return;
        }
        this.getMessages().subscribe();
    };

    setMessagesAndPagination = (data: HttpResponse<Message[]>) => {
        const linkHeader = data.headers.get('link');
        const pagination = linkHeader ? getPaginationFromHeader(linkHeader) : null;

        let changePageTo: number | string | undefined;
        const currentPaginationLastPage = pagination && pagination[pagination.length - 1].params._page;
        const lastPaginationLastPage = this.paginationParams && this.paginationParams[this.paginationParams.length - 1].params._page;

        if (this.gotoLastPage && currentPaginationLastPage && !this.route.snapshot.queryParams['q']) {
            changePageTo = currentPaginationLastPage;
            this.gotoLastPage = undefined;
        } else if (!pagination && this.route.snapshot.queryParams['_page']) {
            changePageTo = lastPaginationLastPage ? +lastPaginationLastPage - 1 : 1;
        }


        if (changePageTo) {
            this.router
                .navigate(
                    [],
                    {
                        relativeTo: this.route,
                        queryParams: { _page: changePageTo == 1 ? undefined : changePageTo },
                        queryParamsHandling: 'merge',
                    }).then(() => this.getMessages().subscribe());
            return;
        }

        this.pagination$.next(pagination);
        this.paginationParams = pagination;
        data.body && this.messages$.next(data.body);
        this.messagesLoading$.next(false);
    };

    getMessages() {
        const { _page, _limit, q } = this.route.snapshot.queryParams;
        let url = `/messages?_page=${+_page || 1}&_limit=${+_limit || this.defaultLimit}`;
        if (q) {
            url += `&q=${q}`;
        }
        return this.http.get<Message[]>(url, { observe: 'response' }).pipe(
            tap((data) => this.setMessagesAndPagination(data))
        );
    }

    removeMessage(id: Message['id']) {
        this.messagesLoading$.next(true);
        return this.http.delete(`/messages/${id}`).pipe(tap(this.getActualMessages));
    }

    editMessage(id: Message['id'], message: Message['message']) {
        this.messagesLoading$.next(true);
        return this.http.patch(`/messages/${id}`, { message }, this.httpOptions).pipe(tap(this.getActualMessages));
    }

    addMessage(message: PostMessage) {
        this.messagesLoading$.next(true);
        this.gotoLastPage = true;
        return this.http.post('/messages', JSON.stringify(message), this.httpOptions).pipe(tap(this.getActualMessages));
    }

    getSearchResults() {
        this.messagesLoading$.next(true);
        const { _page, _limit, q } = this.route.snapshot.queryParams;
        return this.http.get<Message[]>(`/messages?q=${q}&_page=${+_page || 1}&_limit=${+_limit || this.defaultLimit}`, { observe: 'response' }).pipe(
            tap(this.setMessagesAndPagination)
        );
    }
}
