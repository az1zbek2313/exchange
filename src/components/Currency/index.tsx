import '../../App.css'
import uz from "../../assets/image/uz.svg"
import us from "../../assets/image/us.svg"
import {useEffect, useState} from "react";
import { useRef } from 'react'
import data from "../../assets/currency-flags.json";


function Currency() {
    const [quantity, setQuantity] = useState<number>(localStorage.getItem("amount")?Number(localStorage.getItem("amount")):0);
    const [exchange, setExchange] = useState<boolean>(false);
    const [convert, setConvert] = useState("");
    const [values, setValue] = useState<string>("AF");
    const amount = useRef<HTMLInputElement>(null);
    const from = useRef<HTMLSelectElement>(null);
    const to = useRef<HTMLSelectElement>(null);

    // VALIDATE 
    function validate(amount:number) {
        if (amount < 0) {
            alert("Son 0 dan katta bo'lishi shart!");
            return false;
        }
        return true;
    }


    // EVENTS
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (validate(Number(amount.current?.value))) {
            setQuantity(Number(amount.current?.value));
            localStorage.setItem("amount", JSON.stringify(amount));
        }
    }

    function handleExchange() {
        exchange ? setExchange(false) : setExchange(true);        
    }

    function handleChange1(e:  React.ChangeEvent<HTMLSelectElement>) {
        setValue(e.target?.value);        
    }
    
    console.log(values);
    
    useEffect(() => {
        fetch("https://api.fastforex.io/fetch-all?api_key=a58c7e9b7a-988376f8c5-sc54ik")
            .then(res => res.json())
            .then(data => {
                setConvert(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    
    
    

  return (
    <div className="hero__currency">
              <div className="currency__header">
                <ul>
                  <li><i className="fa-solid fa-arrow-right-arrow-left"></i> Convert</li>
                  <li><i className="fa-regular fa-paper-plane"></i> Send</li>
                  <li><i className="fa-solid fa-chart-simple"></i> Charts</li>
                  <li><i className="fa-sharp fa-regular fa-bell"></i> Alerts</li>
                </ul>
              </div>
              <form onSubmit={handleSubmit} className="currency__exchange">

                <div className="currency__input">
                    <label htmlFor="Amount">Amount</label>
                    <input ref={amount} type="number" placeholder={`sum`}/>
                </div>

                <div className="currency__input">
                    <label htmlFor="Amount">
                        <span>From</span> 
                        {
                                data && data.map((el, index) => {
                                    return el.code == values && <img key={index} width={32} src={el.flag} alt="flag icon" />
                                })
                            }
                    </label>
                        <select onChange={handleChange1} ref={from} name="currency" id="Amount">
                            {
                                data && data.map((el, index) => {
                                    return <option key={index} value={`${el.code}`}>
                                        {el.currency.name + " " + el.currency.code}
                                    </option>
                                })
                            }
                        </select>
                </div>

                <div onClick={handleExchange} className="currency--exchange">
                    <i className="fa-solid fa-arrow-right-arrow-left"></i> 
                </div>
                
                <div className="currency__input">
                    <label htmlFor="Amount">
                        <span>To</span> 
                        <img width={32} src={us} alt="flag icon" />
                    </label>
                        <select ref={to} name="currency" id="Amount">
                            <option value="US">US Dollars</option>
                        </select>
                </div>
                
              </form>

              <div className="currency__priceChange">
                <h5>{`${quantity}`}.00 Uzbekistani Sums =</h5>
                <h1>0.00<span className="faded-digits">007988</span> US Dollars</h1>
                 <div>
                    <p>1 UZS = 0.0000790852 USD</p>
                    <p>1 USD = 12,644.6 UZS</p>
                </div>
              </div>
            </div>
  )
}

export default Currency