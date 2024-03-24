import { ClassController } from '~/controller/class.controller';

export async function generateStaticParams() {
    const classController = new ClassController();

    const res = await classController.getAllClass();

    const data = res.map((item: { uuid: string }) => ({ classUuid: item.uuid }));

    return data;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
