import React, {Component} from "react";

class Table extends Component {
    render(){
        return (
            <div>
                Table Component
            </div>
        )
    }

    componentDidMount(){
        try {
            let values = queryString.parse(this.props.location.search);
            let number = values.uid;
            this.validateCode(uid, code);
        } catch (error) {
            console.log(error);
        }
    }
}

export default Table;