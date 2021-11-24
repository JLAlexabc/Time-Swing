import React from 'react';
import { Redirect } from 'react-router-dom';
import Autocomplete from "react-google-autocomplete";

const API_KEY = process.env.REACT_APP_API_KEY
console.log(API_KEY)
class PostAgenda extends React.Component {
    state = {
      error: false,
      success: false,
      more:'none',
      moreOrless:"More",
      content:{
          title:'',
          timeStart:'',
          timeEnd:'',
          content:'',
          address:''
      }, 
  }

  // componentDidMount(){
  //   const url='/api/auth/login'
  //   fetch(url)
  //       .then(response=>{
  //           if(!response.ok){
  //               throw new Error('Unauthenticated')
  //           }

  //           return response.json()
  //       })
  //       .then(body=>setUser(body))
  //       .catch(err=>setUser(false))
  // }

  handleChanged = (event) =>{
    const {name, value} = event.target
    // console.log(name,value)
    // console.log("name: "+name+ "...value:"+value)
    this.setState(preData=>{
      return {
          ...preData,
          content:{
              ...preData.content,
              [name]:value
          }
      }
      
  })
}

  showMore = (e) =>{
    if(this.state.more === ''){
      this.setState({more:'none',moreOrless:'More'})
    }
    else{
      this.setState({more:'',moreOrless:'Less'})
    }
  }

  saveAgenda = (event) => {
    // console.log(JSON.stringify(this.state.content))
    fetch("/api/agenda/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.content),
    })
      .then(res => {
        if(res.ok) {
          return res.json()
        }

        throw new Error('Content validation');
      })
      .then(post => {
        this.setState({
          success: true,
        });
      })
      .catch(err => {
        this.setState({
          error: true,
        });
      });
  }

  render() {
    if(this.state.success) return <Redirect to="/" />;

    let errorMessage = null;
    if(this.state.error) {
      errorMessage = (
        <div className="alert alert-danger">
          "There was an error saving this post."
        </div>
      );
    }

    return (
      <div>
        { errorMessage }
        <div>
          <input 
            type="text" 
            placeholder="Type the title" 
            name="title"
            value={this.state.content.title}
            onChange={this.handleChanged}
          />
        </div>
        <br/>

        <div>
          <input 
              type="datetime-local" 
              name="timeStart"
              value={this.state.content.timeStart}
              onChange={this.handleChanged}
            />
        </div>
        <br/>


        <button onClick={this.showMore}>{this.state.moreOrless}</button>
        <br/>
        <div style={{display:this.state.more}}>
        <div>
          <br/>
        <Autocomplete
         apiKey={API_KEY}
         options={{
          types: ["address"],
          componentRestrictions: { country: "us" }
        }}
        onPlaceSelected={(place) => {
          console.log(place.formatted_address)
          this.setState(preData=>{
            return {
                ...preData,
                content:{
                    ...preData.content,
                    ["address"]:place.formatted_address
                }
            }
        })
        }}        
/>;
          <br/>
        </div>
        <br/>
        <div>
        <input 
              type="datetime-local" 
              name="timeEnd"
              value={this.state.content.timeEnd}
              onChange={this.handleChanged}
            />
        </div>
        <br/>
        <div>
          <textarea 
            name="content"
            placeholder="Content" 
            value={this.state.content.content}
            onChange={this.handleChanged}
          />
          <br/>
        </div>
        </div>

        <br/>
        <div>
          <button className="btn btn-primary" onClick={this.saveAgenda}>Save Post</button>
        </div>
      </div>
    );
  }
}

export default PostAgenda;