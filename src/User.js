import React, { Component } from 'react';
import axios from 'axios';
import { faker } from '@faker-js/faker'

class User extends Component{
  constructor(){
    super();
    this.state = {
      user: {},
      stories: [] 
    };
    this.destroy = this.destroy.bind(this);
    this.create = this.create.bind(this);
  }
  async create(user){
    const response = await axios.post(`/api/users/${user.id}/stories`, {
      title: faker.random.words(5),
      body: faker.lorem.paragraphs(5),
      favorite: faker.datatype.boolean()
    });
    const stories = [...this.state.stories, response.data];
    this.setState({ stories });
  }
  async destroy(story){
    await axios.delete(`/api/stories/${story.id}`)
    const stories = this.state.stories.filter(_story => _story.id !== story.id);
    this.setState({stories});
  }
  async componentDidMount(){
    let response = await axios.get(`/api/users/${this.props.userId}`);
    this.setState({ user: response.data });
    response = await axios.get(`/api/users/${this.props.userId}/stories`);
    this.setState({ stories: response.data });

  }
  async componentDidUpdate(prevProps){
    if(prevProps.userId !== this.props.userId){
      let response = await axios.get(`/api/users/${this.props.userId}`);
      this.setState({ user: response.data });
      response = await axios.get(`/api/users/${this.props.userId}/stories`);
      this.setState({ stories: response.data });
      
    }
  }
  render(){
    const { user, stories } = this.state;
    const { destroy, create } = this;
    console.log(stories);
    return (
      <div>
        Details for { user.name }
        <p>
          { user.bio }
        </p>
        <button onClick={()=> create(user) }>Generate New Story</button>
        <ul>
          {
            stories.map( story => {
              return (
                <li key={ story.id }>
                  { story.title }
                  <button onClick={()=> destroy(story)}>X</button>
                  <p>
                  { story.body }
                  </p>
                </li>

              );
            })
          }
        </ul>
      </div>
    );
  }
}



export default User;
