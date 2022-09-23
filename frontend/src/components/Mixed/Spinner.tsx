import { Image } from '@chakra-ui/react';
import svg from '../../images/spinner.svg';

interface ISpinnerProps {
  width: string;
  height: string;
}

const Spinner = ({ width, height }: ISpinnerProps) => {
  return <Image width={width} height={height} src={svg} alt="spinner" />;
};

export default Spinner;
