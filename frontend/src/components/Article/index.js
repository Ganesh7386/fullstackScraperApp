import './index.css';
import { FaCalendarAlt , FaClock , FaUser, FaUserCircle, FaUserAlt} from 'react-icons/fa';

const ArticleComp = (props)=> {
    // console.log(props)
    const {eachArticleDetails} = props;
    const {authorName , title , publicationDate , navigationLink , profileImgUrl} = eachArticleDetails;
    const partsOfDate = publicationDate.split(",")

    return (
    <li className = "eachListItemContainer">
        <div className = "innerContainer">
            <div className = "authorDetailsContainer">
                <img src = {profileImgUrl} alt = {authorName} className = "authorImgStyling" />
                <p><span>{<FaUserCircle color = "white" size = "20px"/>}</span> {authorName}</p>
            </div>
            <h3>{title}</h3>
        <div className = "bottomPublicationDetails">
            <p><span>{<FaCalendarAlt color = "white" size='15px' />}</span> {partsOfDate[0]} <span>{<FaClock color = "white" size = "15px" />}</span> {partsOfDate[1]} </p>
            <a className = "linkElementStyling" href = {navigationLink}>Read Full article here </a>
        </div>
    </div>
    </li>
)

}

export default ArticleComp