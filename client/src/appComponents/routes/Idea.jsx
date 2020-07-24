import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Idea.css";
import { usersApi, ideasApi } from "../../apiConfig.js";
import CommentForm from "./CommentForm";
import { Redirect } from "react-router-dom";
import DeleteComment from "./DeleteComment";
import DeletePost from "./DeletePost";
import Votes from './Votes';

function Idea(props) {

  let myUsername=props.username
  let ideaId = props.match.params.ideatitle;

  const [ideas, setIdea] = useState({});
  const converter = (stamp)=>{
    let foo =  (new Date(stamp))
    return foo.toLocaleString()
}

  useEffect(() => {
    const makeAPICall = async () => {
      try {
        const response = await axios(`${ideasApi}/${ideaId}`);
        console.log("Idea - response", response);
        setIdea(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    makeAPICall();
  }, []);

  let postUsername=ideas.username
  function keytags(array) {
    if (!array) return <p>Loading...</p>;
    else {
      const keytagArr = array.map((item) => (
        <p className="dashboard-ind-key">#{item}</p>
      ));
      return keytagArr;
    }
  }

  let userComments;
  if (!ideas.comments)
    userComments = (
      <div>
        <p>Loading...</p>
      </div>
    );
  else {
    if (!ideas.comments[0])
      userComments = (
        <div>
          <p>There are no comments for this idea, be the first to comment!</p>
        </div>
      );
    else {
      userComments = ideas.comments.map((comm) => {
        return (
          <div className="CommentContainer">
            <div className="Comment-user-and-timestamp">
              <DeleteComment comm={comm} ideaId={ideaId} />
              <p className="dashboard-comment-timestamp">{converter(comm.createdAt)}<br />
                <span className="dashboard-comment-name"><strong>{comm.username}</strong></span> commented:
              </p>
            </div>
            <p className="dashboard-comment-body">{comm.commentBody}</p>
          </div>
        );
      });
    }
  }
  const [comment, setComment] = useState({ commentBody: "" });
  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    const makeAPICall = async () => {
      try {
        const response = await axios(`${ideasApi}/ideas/${ideaId}`);
        setComment({ comment: response.data.comments });
      } catch (err) {
        console.error(err);
      }
    };
    makeAPICall();
  }, []);
  const handleChange = (event) => {
    setComment({
      ...comment,
      username: props.username,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    axios({
      url: `${ideasApi}/comment/${ideaId}`,
      method: "PUT",
      data: comment,
      username: props.username,
    })
      .then(() => setIsUpdated(true))
      .catch(console.error);
  };
  if (isUpdated) {
    window.location.reload();
  }

  return (
    <>
      <div className="FeedUltimateContainer Logged-views">
        {/* <div className="FeedHeaderContainer">
          <div className="FeedHeader">
            <img
              className="FeedHeaderAnimation"
              src="https://res.cloudinary.com/dgmpgmo60/image/upload/v1595116789/Untitled_7_2_vm15aq.png"
              alt="Flashing Lightbulb"
            />
          </div>
        </div> */}
        <div className="MainFeed">
          <div className="dashboard-creative-idea">
            <div className="dashboard-title">
              <div className="Title-and-votes">
                < Votes ideaId={ideaId}
                 />
                <div className="dashboard-title-username-container">
                <h1 className="dashboard-idea-title feedtitle">
                  {ideas.title}
                </h1>
                <h3 className="dashboard-idea-author">{ideas.username}</h3>
                {/* <button>Delete</button> */}
                </div> 
                <DeletePost myUsername={myUsername} postUsername={postUsername} ideaId={ideaId}/>              
            </div>
            {converter(ideas.createdAt)}
            </div>
            <div className="dashboard-desc">
              <p>{ideas.description}</p>
              {/* <img src={ideas.imgSrc}/> */}
              {/* <p>keywords:</p> */}
              <div className="dashboard-keytags">{keytags(ideas.keywords)}</div>
            </div>
          </div>
          <div className="dashboard-comments-section">
            <div className="BarrierContainer">
              <img
                className="CommentBarrier"
                src="https://res.cloudinary.com/dgmpgmo60/image/upload/v1595191527/Untitled_12_taesgk.png"
                alt="Telephone Wire"
              />
            </div>
            {/* <p className='dashboard-comments-title'>Comments</p> */}
            {userComments}
          </div>
          <div className="AddComment">
            <CommentForm
              comment={comment}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              username={props.username}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Idea;
