import {Link} from "react-router-dom";

const Landing = () => {
    return (
        <div>
            <h1>MicroBlog</h1>
            <Link to={"signup"}>Sign up</Link>
        </div>
    )
}

export default Landing