import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject, Subscription, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface Message {
    id: number,
    username: string,
    datetime: number,
    message: string
}

export type PostMessage = Omit<Message, 'id'>

export type pagination = ReturnType<typeof getPaginationFromHeader> | null;

function getPaginationFromHeader(header: string | null) {
    if (!header) return null;

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

    const divider = { params: { _page: '...', _limit: pagination['first'].params._limit }, active: false };
    const paginationPages = [
        pagination['first'],
        ...(pagination['prev'] ? [divider, pagination['prev']] : []),
        ...(pagination['current'] ? [pagination['current']] : []),
        ...(pagination['next'] ? [pagination['next'], divider] : []),
        pagination['last']
    ];

    return paginationPages;
}

@Injectable({
    providedIn: 'root'
})
export class RestService {

    messages$ = new Subject<Message[]>();
    messagesLoading$ = new Subject<boolean>();

    pagination$ = new Subject<pagination>();
    defaultLimit = 10;
    private paginationParams: number[] = [];
    private subscription$?: Subscription;
    private timer?: number;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
    ) { }

    getActualMessages = () => {
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
        const { q } = this.route.snapshot.queryParams;
        if (q) {
            this.getSearchResults().subscribe();
        } else {
            this.getMessages().subscribe();
        }
    };

    setMessagesAndPagination = (data: HttpResponse<Message[]>, _page: string, _limit: string, isSearched?: boolean) => {
        const currentParams = [+_page, ...(_limit ? [+_limit] : [])];
        if (JSON.stringify(this.paginationParams) !== JSON.stringify(currentParams) || isSearched) {
            const linkHeader = data.headers.get('link');
            const pagination = linkHeader ? getPaginationFromHeader(linkHeader) : null;
            this.pagination$.next(pagination);
            this.paginationParams = currentParams;
        }
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
            tap(data => this.setMessagesAndPagination(data, _page, _limit))
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
        return this.http.post('/messages', JSON.stringify(message), this.httpOptions).pipe(tap(this.getActualMessages));
    }

    getSearchResults() {
        this.messagesLoading$.next(true);
        const { _page, _limit, q } = this.route.snapshot.queryParams;
        return this.http.get<Message[]>(`/messages?q=${q}&_page=${+_page || 1}&_limit=${+_limit || this.defaultLimit}`, { observe: 'response' }).pipe(
            tap(data => this.setMessagesAndPagination(data, '1', _limit, true))
        );
    }
}
