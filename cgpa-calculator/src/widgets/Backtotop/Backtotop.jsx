import React,{useState} from 'react'

const Backtotop = () => {

    const[displayback,setdisplayback]= useState(false)

    function scrollfunc() {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            setdisplayback(true);
        } else {
            setdisplayback(false);
        }
    }
    window.addEventListener('scroll',scrollfunc);

    function gototop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }


  return (
    <>
    {displayback && (<div className="back fa fa-chevron-up" onClick={gototop} id="backtotop" ></div>)}
    </>
  )
}

export default Backtotop