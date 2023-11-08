import ScannerPage from "@/pages/ScannerPage/ScannerPage";
import globalStyles from '../../globalStyles.module.css';

const Home = () => {
    return (
        <div className={`${globalStyles.globalStyles} ${globalStyles.darkTheme}`}>
            <ScannerPage/>
        </div>
    );
}

export default Home;