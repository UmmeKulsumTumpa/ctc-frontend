import { FiMapPin } from 'react-icons/fi';

interface MapPinIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

const MapPinIcon = ({ size = 20, ...props }: MapPinIconProps) => (
    <FiMapPin width={size} height={size} {...props} />
);

export default MapPinIcon;
