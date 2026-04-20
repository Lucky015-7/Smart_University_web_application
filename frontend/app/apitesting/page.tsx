'use client'; // Important: Since you use useEffect, this must be a Client Component

// import React, { useEffect, useState } from 'react';
// import { getBaseUrl } from '@/lib/api-client';

// const Page = () => {
//     const [apiResponse, setApiResponse] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchAPI = async () => {
//             try {
//                 const response = await fetch(`${getBaseUrl()}/health`); // Assuming a /health endpoint
//                 if (!response.ok) throw new Error('Network response was not ok');
//                 const data = await response.json();
//                 setApiResponse(data);
//             } catch (err: any) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAPI();
//     }, []);

//     if (loading) return <p>Loading API data...</p>;
//     if (error) return <p className="text-red-500">Error: {error}</p>;

//     return (
//         <div>
//             <h1 className='text-2xl'>API Health Check</h1>
//             {/* Convert object to string to avoid rendering errors */}
//             <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
//         </div>
//     );
// };

// export default Page;





































import { getBaseUrl } from '@/lib/api-client';
import { useEffect, useState } from 'react';

const page = () => {
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    useEffect(() => {
        const fetchAPI = async () => {
            const response = await fetch(`${getBaseUrl()}/health`);
            // const data = await response.json();
            const data = await response.text();
            setApiResponse(data);
        };
        fetchAPI();
    }, []);

    console.log(apiResponse);
    return (
        <div>
            <h1 className='text-2xl'>API Health Check</h1>
            <p>{apiResponse}</p>
        </div>
    )
}

export default page