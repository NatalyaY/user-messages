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
        style: 'background-color: black;color: white; font-size: 0.875rem;'
    },
    {
        key: 'username',
        label: 'Ник пользователя',
        visible: true,
        order: 0,
        style: 'background-color: yellow;font-size: 0.775rem;'
    },
    {
        key: 'datetime',
        label: 'Дата сообщения',
        visible: true,
        order: 3,
        style: 'font-size: 1.15rem;'
    },
    {
        key: 'message',
        label: 'Сообщение',
        visible: true,
        order: 2,
        style: 'font-size: 1.15rem;'
    },
];

export default tableColumns;