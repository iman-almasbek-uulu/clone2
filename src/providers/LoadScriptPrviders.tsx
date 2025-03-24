import { LoadScript } from '@react-google-maps/api';
import React from 'react';

interface LoadScriptPrvidersProps {
    children: React.ReactNode
}
const LoadScriptPrviders: React.FC<LoadScriptPrvidersProps> = ({children}) => {
    return (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          libraries={["places"]}
        >
          {children}
        </LoadScript>
    );
};

export default LoadScriptPrviders;