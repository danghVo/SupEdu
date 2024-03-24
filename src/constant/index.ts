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
export const minute = new Array(60).fill(-1).map((item, index) => index);

export const day = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const classDetailSections = [
    { name: 'Lớp học', path: 'post' },
    { name: 'Bài tập', path: 'exercise' },
    { name: 'Thành viên', path: 'member' },
];

export const postType = [
    { name: 'Thông báo', submit: 'Announcement' },
    { name: 'Bài tập', submit: 'Exercise' },
    { name: 'Bình chọn', submit: 'Vote' },
];

export const buttonActionName = ['Đăng', 'Đặt hẹn', 'Lưu'];

export const fontSizeEditor = ['normal', 'medium', 'big'];

export const roleTranslate: {
    [index: string]: string;
} = {
    student: 'học viên',
    teacher: 'giáo viên',
};

export interface FileType {
    uuid?: string;
    key?: string;
    name: string;
    path: string;
    extension: string;
    color: string;
}

export interface TimeData {
    date: string;
    time: string;
}

export const fileExtensions = [
    { extension: 'csv', color: '#00C650' },
    { extension: 'pdf', color: '#FF3E4C' },
    { extension: 'vnd.openxmlformats-officedocument.wordprocessingml.document', color: '#0072FF' },
    { extension: 'msword', color: '0072FF' },
    { extension: 'png', color: '#005FAD' },
    { extension: 'iso', color: '#0072FF' },
    { extension: 'exe', color: '#0072FF' },
    { extension: 'gif', color: '#FF9908' },
    { extension: 'html', color: '#00C650' },
    { extension: 'java', color: '#FF3E4C' },
    { extension: 'xml', color: '#A140FF' },
    { extension: 'jpg', color: '#00C650' },
    { extension: 'rar', color: '#A140FF' },
    { extension: 'javascript', color: '#ffb246' },
];
