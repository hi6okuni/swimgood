import React, { useEffect } from 'react';

export default function AdsCard(props) {
    useEffect(() => {
        if (window.adsbygoogle && process.env.VERCEL_ENV !== "development") {
            window.adsbygoogle.push({});
        }
    }, [])

    return (
            <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-5934737933948157"
            data-ad-slot="7015925131"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    );
}