import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

export default class CreateExercise extends Component{
constructor(props) {
    //In Javascript classes, always call super when defining the constructor of a subclass
    super(props);

    //You have to manually bind event handlers to functions in react because of an underlying behavior in base Javascript:
    //The scope (accessable stuff) the function has access to is defined when the function is called. Because node passes references to the functions to external objects
    //without passing the entire CreateExercise object along with them, when the function is called, the scope is set to the same scope as whatever called the function externally.
    //To avoid this, we explicitly bind the scope of the event handler functions to the CreateExercise object (this). That way, no matter where the reference to the function ends up,
    //it brings access to the component's internal date, ie: the state object and other internal functions
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    //In React, all component subclasses have a state object that represents the object behind the component
    //This should generally map to a MongoDB document
    //Unlike a 'let' variable, anytime a property within the state object is changed, the page will update to display the change
    this.state = {
        username: '',
        description: '',
        duration: 0,
        date: new Date(),
        users: []
    }
}

    //Lifecycle methods that will call periodically as React goes about its business
    //Like update() in Unity
    //componentDidMount will be called just before a page loads
    componentDidMount(){
        axios.get('http://localhost:5000/users/')
            .then(res => {
                if(res.data.length > 0){
                    //Set the users array of the state objet to a mapping of the users API response
                    //Where you only take the username from each user
                    this.setState({
                        users: res.data.map(user => user.username),
                        username: res.data[0].username
                    });
                }
            });



        this.setState({
            users: ['testUser'],
            username: 'test user'
        });
    }

    //When the username on the page changes, update the username in the state
    onChangeUsername(e){
        //NEVER use something like this.state.username = e.newUsername
        //ALWAYS use the setState function that comes with react components
        //Set State supports partial updates; everything but username will stay the same
        this.setState({
            //In this case, e represents the html object being changed
            username: e.target.value
        });
    }

    onChangeDescription(e){
        this.setState({
            description: e.target.value
        });
    }
    
    onChangeDuration(e){
        this.setState({
            duration: e.target.value
        });
    }
    
    onChangeDate(_date){
        this.setState({
            date: _date
        });
    }
    
    onSubmit(e){
        //Prevents the normal html form behavior from happening, 
        //ie: refreshing the page and sending the form doc to an action url
        e.preventDefault();

        const exercise = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }

        console.log(exercise);

        axios.post('http://localhost:5000/exercises/add', exercise)
        .then(res => console.log(res.data));

        //Take the user back to the homepage
        window.location = '/';
    }

    render() {
        return (
            <div>
                <h3>Create New Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <select ref="userInput"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}>
                                {
                                    //map allows us to return stuff from an array
                                    //each member of the user array returns an <option> html element                                    
                                    this.state.users.map(function(user){
                                      return <option
                                        key={user}
                                        value={user}>{user}
                                        </option>;  
                                    })
                                }
                            </select>
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration (in minutes):</label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date :</label>
                        <div>
                            <DatePicker
                                selected={this.state.date}
                                onChange={this.onChangeDate}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create Exercise Log" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}