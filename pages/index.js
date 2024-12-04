import Head from "next/head";
import VideoInput from "@/components/VideoInput";
import { MonitorPlay } from "lucide-react";
import { siteUrl } from "@/utils/config";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
    return (
        <>
            <Head>
                <title>Embedded Video</title>
                <meta name="description" content="Embed large video files on Discord" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" type="image/x-icon" href="/animated_favicon.gif" />
                <meta property="og:site_name" content="Embedded Video"></meta>
                <meta property="og:title" content="Embedded Video" />
                <meta property="og:description" content="Embed large video files on Discord" />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content="https://github.com/user-attachments/assets/ab678426-8ceb-49e1-b79c-c5535ff5be7c"
                ></meta>
                <meta name="theme-color" content="#23272A"></meta>
                <meta property="og:url" content={siteUrl} />
                <Analytics />
            </Head>
            <main className="bg-black flex items-center justify-center min-h-screen text-white">
                <div className="text-center space-y-6 p-4 max-w-2xl w-full">
                    <MonitorPlay className="mx-auto w-16 h-16 text-gray-300" />
                    <h1 className="text-2xl font-semibold">Embedded Video</h1>
                    <p className="text-gray-400">A service to embed files bigger than 50MB on Discord.</p>
                    <VideoInput />
                </div>
            </main>
        </>
    );
}
