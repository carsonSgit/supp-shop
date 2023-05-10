import "components/Card.css"


function Card({ children, image}){
    return(
        <div className="card">
            {image && <img className="card-img" src={image} alt=""></img>} 
            {children}
        </div>
    )
}

export default Card;