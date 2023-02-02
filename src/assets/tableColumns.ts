import { Message } from 'src/app/rest.service';

interface Column {
    key: keyof Message,
    label: string,
    visible: boolean,
    order: number,
    style: string
}

const tableColumns: Column[] = [
    {
        key: 'id',
        label: 'id',
        visible: true,
        order: 1,
        style: 'background-color: black;color: var(--accent); font-size: 0.875em;'
    },
    {
        key: 'username',
        label: 'Ник пользователя',
        visible: true,
        order: 0,
        style: 'background-color: var(--accent-transparent) ;font-size: 0.775em;'
    },
    {
        key: 'datetime',
        label: 'Дата сообщения',
        visible: true,
        order: 3,
        style: 'font-size: 1.15em;'
    },
    {
        key: 'message',
        label: 'Сообщение',
        visible: true,
        order: 2,
        style: 'font-size: 1.15em;'
    },
];

export default tableColumns;