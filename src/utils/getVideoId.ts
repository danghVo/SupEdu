export default function getVideoId(src: string) {
    if (!src) {
        return null;
    }

    const RegExSplit =
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/;

    const urlSplit = src.split(RegExSplit);

    if (urlSplit.length > 1) {
        return urlSplit[1];
    } else return null;
}
