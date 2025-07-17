import React, { useEffect, useState } from 'react'

const Board = () => {
    const [User, setUser] = useState('')
    const [Task_data, setTask_data] = useState({
        "Task":"",
        "Date":"",
        "Describe":""
    })
    const [editingIndex, setEditingIndex] = useState(null);
const [emailInput, setEmailInput] = useState("");
    const [Ok, setOk] = useState(false)
    const [All_task, setAll_task] = useState([])
    const token=localStorage.getItem("token")
    const delete_task=async(id)=>{
        try{
            const response=await fetch ("http://127.0.0.1:5000/api/delete",{
                     method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({
                    "id":id
                })


            })
             const data=await response.json()
        }catch(e){

        }
    }
    const add_email=async(idx)=>{
        try{
            const response=await fetch ("http://127.0.0.1:5000/api/add_email",{
                     method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({
                    "email":emailInput,
                    "id":idx
                })


            })
             const data=await response.json()
        }catch(e){

        }
    }
    const get_all_task=async()=>{
        try{
            const response=await fetch ("http://127.0.0.1:5000/api/Get_all/task",{
                     method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${token}`
                }

            })
            const data=await response.json()

            console.log(data)
            setAll_task(data.Tasks)
        }catch(e){
            console.log(e)
        }
    }
    const add_task=async()=>{
        try{
            const response=await fetch ("http://127.0.0.1:5000/api/add_task",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify(Task_data)

            })
        }catch(e){
            console.log(e)
        }finally{
            setTask_data.Task=""
            setTask_data.Date=""
        }
    }
    useEffect(() => {
    get_all_task()
 const intervalId = setInterval(() => {
    get_all_task();
  }, 500); 
  return () => clearInterval(intervalId);}, [])
    
  return (
    <div className='w-[100%] h-[100%] bg-black text-white'>
        <section className='flex p-12'>
            <div className='rounded-4xl w-[561px] bg-blue-950 space-x-3 space-y-5 '>
                    <h1 className='text-2xl font-semibold p-7' ><i class="fa-solid fa-inbox mr-3"></i>Inbox</h1>
                  <div className='bg-blue-800 p-5 rounded-3xl shadow-lg space-y-4 h-[820px]'>
  <label className='text-white font-semibold text-lg'>Create New Card</label>

  <input
    type='text'
    placeholder='Describe'
    required
    value={Task_data.Describe}
    onChange={(e)=>{setTask_data({...Task_data,Describe:e.target.value})}}
    className='bg-gray-700 text-white rounded-xl p-4 w-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300'
  />
    <label className='text-white font-semibold text-lg'>Description</label>

  <input
    type='text'
    placeholder='Title'
    required
    value={Task_data.Task}
    onChange={(e)=>{setTask_data({...Task_data,Task:e.target.value})}}
    className='bg-gray-700 text-white rounded-xl p-4 w-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300'
  />
<label>Expiry Date</label>
  <input
    type='date'
    required
    value={Task_data.Date}
    onChange={(e)=>{setTask_data({...Task_data,Date:e.target.value})}}
    className='bg-gray-700 text-white rounded-xl p-4 w-full placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300'
  />
  {Task_data.Date}

  <button
  onClick={add_task}
    className='w-full bg-blue-500 hover:bg-blue-600 transition duration-300 text-white font-semibold py-3 rounded-xl mt-2 shadow-md'
  >
    + Add Card
  </button>
</div>

            </div>
            <div className='w-screen overflow-x-hidden border ml-12 rounded-4xl bg-[#473699]' >
                <div className='p-4 pl-7  text-3xl font-semibold pt-8 rounded-4xl pb-7 w-full bg-[#473699]'>My Task Board
<i class="fa-solid fa-list-check ml-7 "></i></div>
<div className='   h-[830px] rounded-4xl  bg-gradient-to-br from-[#473699] via-[#8F7EE7] to-[#DA62AC] flex overflow-x-scroll'>
    <div className="h-full  text-white p-6 rounded-l-4xl flex whitespace-nowrap overflow-y-hidden">
{All_task.length > 0 ? (
  <div className="flex  gap-6">
    {All_task.map((task, index) => (
      <div
  key={index}
  className="bg-gray-900 text-white rounded-xl shadow-lg p-6 min-w-[300px] max-w-xs flex flex-col"
>
  <h3 className="text-xl font-bold mb-2 text-center">{task.Date}</h3>
  <p className="text-xl mb-3 text-center">{task.Task}</p>
<p className=" text-sm mb-3 text-center">{task.Describe}</p>
  <button
    className="rounded-full border p-3 hover:bg-gray-700 self-center"
    onClick={() =>
      setEditingIndex(editingIndex === index ? null : index)
    }
  >
    <i className="fa-solid fa-plus"></i>
  </button>

  {editingIndex === index && (
    <div className="flex flex-col gap-2 mt-4">
      <input
        type="email"
        placeholder="Enter email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        className="bg-gray-700 text-white p-3 rounded placeholder-gray-400"
      />
      <button
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={() => {
          setEditingIndex(null);
          add_email(index);
        }}
      >
        Add Email
      </button>
    </div>
  )}

  {task.emails && task.emails.length > 0 && (
    <div className="mt-4">
      <p className="text-sm text-gray-300 font-medium mb-1">Shared With:</p>
      <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
        {task.emails.map((email, idx) => (
          <li key={idx}>{email}</li>
        ))}
      </ul>
    </div>
  )}

  <button className="mt-auto text-red-400 hover:text-red-600 transition font-semibold"
  onClick={()=>{
    delete_task(task.id)
  }}>
    Delete Task
  </button>
</div>

    ))}
  </div>
) : (
  <div className="text-lg text-gray-300">No Tasks Found</div>
)}

</div>

    
 </div>

            </div>
        </section>
    </div>
  )
}

export default Board