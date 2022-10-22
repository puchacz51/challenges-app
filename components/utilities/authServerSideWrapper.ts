import { GetServerSideProps } from 'next';

interface AuthServerSideWrapper {
  getServerSideProps: GetServerSideProps;
}

const authServerSideWrapper = (getServerSideProps) => {
	const p=0;

};

export default authServerSideWrapper;
