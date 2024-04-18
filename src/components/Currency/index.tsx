import '../../App.css'
import uz from "../../assets/image/uz.svg"
import us from "../../assets/image/us.svg"
import {useEffect, useState} from "react";
import { useRef } from 'react'
import data from "../../assets/currency-flags.json";

type ConvertProps = {
    base: string,
    results: {
        AFN:number
    }
    updated: string,
    ms: number
}


function Currency() {
    const [quantity, setQuantity] = useState<number>(localStorage.getItem("amount")?Number(localStorage.getItem("amount")):0);
    const [exchange, setExchange] = useState<boolean>(false);
    const [convert, setConvert] = useState<ConvertProps[] | any>(null);
    const [country, setCountry] = useState<number>(0);
    const [decimalPart, setDecimal] = useState<string>("0.00");
    const [whole, setWhole] = useState<string>("");
    const [values, setValue] = useState<string>("AFN");
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
        const inputValue = Number(amount.current?.value); // Extracting the value
        if (validate(inputValue)) {
            setQuantity(inputValue);
            localStorage.setItem("amount", String(inputValue)); // Storing the value as a string
            const son = !exchange ? Number(1/qiymat) * inputValue : Number(qiymat) * inputValue ; 
            const son1 = exchange ? Number(1/qiymat) * inputValue : Number(qiymat) * inputValue ; 
            const qoldiq:number = !exchange ? (son % 1) : (son1 % 1);
            const decimalPart = qoldiq.toString().substring(4, 8);
            const whole = Math.trunc(son) +'.' + qoldiq.toString().substring(2, 4);
            setDecimal(decimalPart);
            setWhole(whole);
        }
    }
    

    function handleExchange() {
        exchange ? setExchange(false) : setExchange(true);        
    }

    function handleChange1(e:  React.ChangeEvent<HTMLSelectElement>) {
        setValue(e.target?.value);        
    }

    const currencyKeys = convert?.results && Object.keys(convert?.results);
    const currencyValues = convert?.results && Object.values(convert?.results);

    useEffect(() => {
    const ind = currencyKeys && currencyKeys.findIndex((el:any) => el === values);
    if (ind !== -1) {
        setCountry(ind);
    }
    }, [currencyKeys, values]);
    const qiymat = currencyValues && currencyValues.find((el:any, index:number) => {
        return el && country == index
    })    

    
    const symbole = data.find(el => el.currency?.code == values);
    
    useEffect(() => {
    const son = !exchange ? Number(1/qiymat) * quantity : Number(qiymat) * quantity ; 
    const son1 = exchange ? Number(1/qiymat) * quantity : Number(qiymat) * quantity ; 
    const qoldiq:number = !exchange ? (son % 1) : (son1 % 1);
    const decimalPart = qoldiq.toString().substring(4, 8);
    const whole = Math.trunc(son) +'.' + qoldiq.toString().substring(2, 4);
    setDecimal(decimalPart);
    setWhole(whole);
    console.log(quantity);
}, [quantity, exchange, qiymat]);

    
    useEffect(() => {

        fetch("https://api.fastforex.io/fetch-all?api_key=a58c7e9b7a-988376f8c5-sc54ik")
            .then(res => res.json())
            .then(data => {
                setConvert(data);
            })
            .catch(err => {
                console.log(err);
            });
        
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
                    <input defaultValue={quantity} ref={amount} type="number" placeholder={!exchange ? `${symbole?.currency.symbol ? symbole?.currency.symbol : symbole?.currency.code}`:"$"}/>
                </div>

                <div className="currency__input">
                    <label htmlFor="Amount">
                        <span>From</span> 
                       {
                        !exchange ? 
                            data && data.map((el, index) => {
                                return el.currency.code == values && <img key={index} width={32} src={el.flag ? el.flag : uz} alt="flag icon" />
                            }) :
                            <img width={32} src={us} alt="flag icon" />
                       }
                    </label>
                       {
                        !exchange ?
                        <select onChange={handleChange1} ref={from} name="currency" id="Amount">
                            {
                                data && data.map((el, index) => {
                                    return <option key={index} value={`${el.currency.code}`}>
                                        {el.currency.name + " " + el.currency.code}
                                    </option>
                                })
                            }
                        </select>:
                        <select ref={from} name="currency" id="Amount">
                            <option value="US">US Dollars</option>
                        </select>
                        }
                </div>

                <div onClick={handleExchange} className="currency--exchange">
                    <i className="fa-solid fa-arrow-right-arrow-left"></i> 
                </div>
                
                <div className="currency__input">
                    <label htmlFor="Amount">
                        <span>To</span> 
                        {
                            !exchange ? 
                            <img width={32} src={us} alt="flag icon" />
                            :
                            data && data.map((el, index) => {
                                return el.currency.code == values && <img key={index} width={32} src={el.flag ? el.flag : uz} alt="flag icon" />
                            })
                        }
                    </label>
                       {
                        !exchange ?
                        <select ref={to} name="currency" id="Amount">
                            <option value="US">US Dollars</option>
                        </select> :
                         <select onChange={handleChange1} ref={to} name="currency" id="Amount">
                         {
                             data && data.map((el, index) => {
                                 return <option key={index} value={`${el.currency.code}`}>
                                     {el.currency.name + " " + el.currency.code}
                                 </option>
                             })
                         }
                     </select>
                        }
                </div>
                
              </form>

              <div className="currency__priceChange">
                <h5>{`${quantity}`}.00 {!exchange ? (data && data.map(el => (values == el.currency.code && el.currency.name))):"United State Dollar"} =</h5>
                <h1>{whole}<span className="faded-digits">{decimalPart ? decimalPart : "00"}</span> US Dollars</h1>
                 {
                    !exchange ?
                    <div>
                    <p>1 {values} = {1 / qiymat} USD</p>
                    <p>1 USD = {qiymat} {values}</p>
                </div>:
                <div>
                    <p>1 USD = {qiymat} {values}</p>
                    <p>1 {values} = {1 / qiymat} USD</p>
                </div>
                 }
              </div>
            </div>
  )
}

export default Currency