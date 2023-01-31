import { Message } from 'src/app/rest.service';

interface Column {
    key: keyof Message,
    label: string,
    visible: boolean
}

const tableColumns: Column[] = [
    {
        key: 'id',
        label: 'id',
        visible: false,
    },
    {
        key: 'username',
        label: 'Ник пользователя',
        visible: true,
    },
    {
        key: 'datetime',
        label: 'Дата сообщения',
        visible: true,
    },
    {
        key: 'message',
        label: 'Сообщение',
        visible: true,
    },
];

export default tableColumns;