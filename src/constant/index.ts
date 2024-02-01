export const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const hour = new Array(24).fill(-1).map((item, index) => index);

export const day = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const classDetailSections = [{ name: 'Lớp học' }, { name: 'Bài tập' }, { name: 'Thành viên' }];

export const postType = ['Thông báo', 'Bài tập', 'Vote'];

export const buttonActionName = ['Đăng', 'Đặt hẹn', 'Lưu'];

export const fontSizeEditor = ['normal', 'medium', 'big'];

export interface FileType {
    name: string;
    path: string;
    type: string;
}

export interface TimeData {
    date: string;
    time: number;
}

export const fileTypes = [
    'csv',
    'docx',
    'exe',
    'gif',
    'html',
    'iso',
    'java',
    'javascript',
    'jpg',
    'rar',
    'png',
    'rar',
    'xml',
];
