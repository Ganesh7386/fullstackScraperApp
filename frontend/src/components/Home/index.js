import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ArticleComp from '../Article/index'
import { ClockLoader} from 'react-spinners'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './index.css'; // Make sure this CSS file is correctly linked

const Container = styled.div`
    background-color: #000000;
    margin: 0px;
    color: white;
    height : 3000px;
    width : 100%;
`;

function Home() {
    const [articlesList, setArticlesList] = useState([]);
    const [isLoading, setLoading] = useState("true"); // Changed to boolean
    const [searchValue, setSearchValue] = useState('');
    const [errorMsg , setErrorMsg] = useState('')
    const [formErrorMsg , setFormErrorMsg] = useState('')
    const [PagesNo , setPageNo] = useState(1)


    useEffect(()=> {
        // the below code is used for getting data stored in local storage , which was retrieved from earlier searches
        let storedList = localStorage.getItem("articles");
        setLoading("true");
        console.log("use effect invoked");
        if(storedList) {
            try {
                const parsedList = JSON.parse(storedList);
                setArticlesList(parsedList);
                setLoading("false")
                
            }
            catch(e) {
                console.log(e.message);
            }
        }
        else {
            setLoading("false")
            setPageNo(1);
        }

    },[])

    const getArticlesBasedOnSearchValue = async () => {
        console.log("search function invoked");
        setErrorMsg("")
        setLoading("true")
        const apiDetails = {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({prompt : searchValue})
        }
        if(searchValue === "") {
            setFormErrorMsg("Enter non -empty search value");
        }
        else {
        const articlesListAsResponse = await fetch("http://localhost:5000/scrape/" , apiDetails);
        const parsedArticlesList = await articlesListAsResponse.json();

        if(parsedArticlesList.ok) {

            const resultList = parsedArticlesList.searchResults;
            // storing results in local storage , which can be used to display previous requested articles when user again opens website

            localStorage.setItem("articles" , JSON.stringify(resultList));
            setArticlesList(parsedArticlesList.searchResults);
            setErrorMsg("")
        }
        else {
            // console.log("got empty list");
            setErrorMsg(parsedArticlesList.errorMsg);
        }
        setLoading("false");
        setPageNo(1);
        }
    };

    // below method for handling search input value
    const handleChangingInput = (event) => {
        setSearchValue(event.target.value);
    };

    // when user press enter key , the search function "getArticlesBasedOnSearchValue" will get started
    const handleKeyDownEnter = (event)=> {
        if(event.key === "Enter") {
            console.log("enter key pressed");
            setErrorMsg("")
            setFormErrorMsg("")
            getArticlesBasedOnSearchValue();
        }
    } 

    const renderSuccessullUi = ()=> {
        console.log(errorMsg);
        if(errorMsg === "") {

            if(articlesList.length === 0) {
                return (<div className = "loadingContainer"><h1>Search for articles</h1></div>)
            }
            else {
                return (<ul className="articlesContainer">
                {
                    articlesList.slice(((PagesNo-1)*5), PagesNo*5).map((eachArticleInfo)=> (<ArticleComp key = {eachArticleInfo.id} eachArticleDetails = {eachArticleInfo} />))
                }
            </ul>)
            }
        }
        else {
            return(
            <div className = "loadingContainer">
                <h1>{errorMsg}</h1>
                <button className = "tryAgainBtn" type = "button" onClick = {getArticlesBasedOnSearchValue} >Retry</button>
            </div>
            )
        }

    }


    const renderComponentBasedOnLoading = ()=> {
        console.log("render method invoked");
        switch(isLoading) {
            case "true":
                return loadingUi();
            case "false":
                return renderSuccessullUi();
            default :
            return null;

        }
    }

    const loadingUi = ()=> {
        if(isLoading=== "true" && articlesList.length === 0 && searchValue=== "") {
            return (
            <h1>Retrieving previous data</h1>
            )
        }
        if(isLoading === "true" && articlesList.length !== 0) {
            return <div className = "loadingContainer"><ClockLoader color="lightblue" loading={isLoading} size={150}/></div>
        }
    }

    const pagesArray = [...Array(Math.ceil(articlesList.length/5))]
    // console.log(pagesArray)

    const shiftPageLeft = ()=> {
        if(PagesNo > 1) {
            setPageNo(PagesNo - 1);
            console.log(PagesNo)
        }
    }

    const shiftPageRight = ()=> {
        if(PagesNo < Math.ceil(Math.ceil(articlesList.length/5))) {
            setPageNo(PagesNo + 1);
            console.log(PagesNo)
        }
    }

    const decideVisibilityOfPagination = ()=> (isLoading=== "true" || (articlesList.length===0) || (errorMsg !== "") ? 'none' : '' );

    const returnStyling = (index)=> (index=== (PagesNo-1) ? 'selectedPageStyling' : 'pageButtonStyling')

    return (
        <div>
        <Container>
            <h1 className = "headingStyling">Articles Search</h1>
            <input className = "inputSearchElementStyling" value={searchValue} type="search" placeholder="Search for article here" onChange={handleChangingInput} onKeyDown={handleKeyDownEnter} />
            <p>{formErrorMsg}</p>
            {renderComponentBasedOnLoading()}
            <div className = {"wholePaginationControllingContainer"} style  = {{display : decideVisibilityOfPagination()}}>
            <button className = "pageChangeButton" onClick = {shiftPageLeft} type = "button"><FaArrowLeft/></button>
            <ul>
            {pagesArray.map((_, index)=> (<button className = {returnStyling(index)} type = "button" key = {index+1}>{index+1}</button>)) }
            </ul>
            <button  className = "pageChangeButton"  onClick = {shiftPageRight} type = "button"><FaArrowRight/></button>
            </div>
        </Container>
        </div>
    );
}

export default Home;
