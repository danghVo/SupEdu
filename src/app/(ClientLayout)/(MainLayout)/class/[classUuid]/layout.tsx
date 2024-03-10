// import {  } from '@tanstack/react-query';

import { Query, QueryClient } from '@tanstack/react-query';
import { ClassController } from '~/controller/class.controller';

export async function generateStaticParams() {
    const queryClient = new QueryClient();
    const classController = new ClassController();

    const res = await queryClient.fetchQuery({
        queryKey: ['classes'],
        queryFn: () => classController.getAllClass(),
    });

    const data = res.map((item: { uuid: string }) => ({ classUuid: item.uuid }));

    return data;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
