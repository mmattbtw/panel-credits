import type { Chatter, Streamer } from '@prisma/client';

export interface sessionType {
    provider: string;
    json: {
        id: string;
        login: string;
        display_name: string;
        type: string;
        broadcaster_type: string;
        description: string;
        profile_image_url: string;
        offline_image_url: string;
        view_count: number;
        created_at: number;
    };
}

export type Panel = {
    id: string;
    chatterId: string;
    streamerId: string;
    title: string;
    markdown: string;
    image?: string;
    link?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date;

    chatter: Chatter;
    streamer: Streamer;
};

export type ChatterPanelCredits = {
    id: string;
    streamerId: string;
    credits: number;

    chatterId: string;
    chatter: Chatter;

    streamer: Streamer;
};
