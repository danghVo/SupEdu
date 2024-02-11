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

export const classDetailSections = [{ name: 'Lớp học' }, { name: 'Bài tập' }, { name: 'Thành viên' }];

export const postType = ['Thông báo', 'Bài tập', 'Vote'];

export const buttonActionName = ['Đăng', 'Đặt hẹn', 'Lưu'];

export const fontSizeEditor = ['normal', 'medium', 'big'];

export interface FileType {
    name: string;
    path: string;
    type: string;
    color: string;
}

export interface TimeData {
    date: string;
    time: string;
}

export const fileTypes = [
    { type: 'csv', color: '#00C650' },
    { type: 'pdf', color: '#FF3E4C' },
    { type: 'vnd.openxmlformats-officedocument.wordprocessingml.document', color: '#0072FF' },
    { type: 'msword', color: '0072FF' },
    { type: 'png', color: '#005FAD' },
    { type: 'iso', color: '#0072FF' },
    { type: 'exe', color: '#0072FF' },
    { type: 'gif', color: '#FF9908' },
    { type: 'html', color: '#00C650' },
    { type: 'java', color: '#FF3E4C' },
    { type: 'xml', color: '#A140FF' },
    { type: 'jpg', color: '#00C650' },
    { type: 'rar', color: '#A140FF' },
    { type: 'javascript', color: '#ffb246' },
];
