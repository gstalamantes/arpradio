
"use client"

export default function Multiple(){

    return(
        <form className="bg-black text-black rounded-xl border-zinc-500 border-[1px] px-4 w-full mx-auto h-full">
        <div className="max-h-[50dvh]  w-[65dvh] mx-auto  overflow-y-auto" >
        <h1 className="text-white my-1">Token Info</h1>
       <div className="formInput"> <label className="formLabel">*Asset Name:</label>
    <input className="inputForm" type="text" required /></div>
    <div  className="formInput"  ><label className="formLabel">*Title: </label>
    <input className="inputForm" type="text" required/></div>
    <div  className="formInput" ><label className="formLabel">*Token Image: </label>
    <input className="inputForm"  accept="image/*" type="file" required/></div>
    <div  className="formInput" ><label className="formLabel">*Release Name: </label>
    <input className="inputForm" title="Provide a display image for the token." type="text" required/></div >
    <h1 className="text-white my-1">Song Details</h1>
    <div  className="formInput" ><label className="formLabel">*Song File: </label>
    <input className="inputForm" type="file" accept="audio/*" required /></div>
    <div  className="formInput" ><label className="formLabel">*Artist: </label>
    <input className="inputForm" type="text" required/></div >
    <div  className="formInput" ><label className="formLabel">Contributing Artists: </label>
    <input className="inputForm" type="text"/></div >
    <div  className="formInput" ><label className="formLabel">*Genre: </label>
    <select className="formSelect">
        <option className="formOption">Alternative</option>
        <option className="formOption">Avant-Garde/Experimental</option>
        <option className="formOption">Blues</option>
        <option className="formOption">Classical/Opera</option>
        <option className="formOption">Country</option>
        <option className="formOption">Easy Listening</option>
        <option className="formOption">Electronic</option>
        <option className="formOption">Folk</option>
        <option className="formOption">Hip-Hop/Rap</option>
        <option className="formOption">Jazz</option>
        <option className="formOption">Latin</option>
        <option className="formOption">Metal</option>
        <option className="formOption">Pop</option>
        <option className="formOption">Punk</option>
        <option className="formOption">R&B</option>
        <option className="formOption">Rock</option>
        <option className="formOption">World</option>
        </select></div>
        <div className="formInput"><label className="formLabel">Sub-Genre: </label>
    <input className="inputForm" type="text"/></div>
    <div className="formInput"><label className="formLabel">Sub-Genre: </label>
    <input className="inputForm" type="text"/></div>
    <div  className="formInput" ><label className="formLabel">*Composition Copyright: </label>
    <input className="inputForm" type="text" placeholder="2024 Artist" title="© is automatically prepended to the input.  Provide the Year and Copyright Holder" /></div>
    <div  className="formInput" ><label className="formLabel">*Recording Copyright: </label>
    <input className="inputForm" type="text" placeholder="2024 Label/Artist" title="℗ is automatically prepended to the input.  Provide the Year and Copyright Holder"/></div>
    </div> 
    <button className="items-center text-white rounded-full mt-1 mx-auto px-4 p-1 border-zinc-300 text-sm border-[1px]" type="submit">Mint</button>
    </form>
    )
}