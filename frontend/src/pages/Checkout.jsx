import {useEffect,useState} from 'react';
import SectionTitle from '../components/SectionTitle';
import {createOrder,createPayment,getData} from '../api/index';

export default function Checkout(){
  const [boxes,setBoxes]=useState([]);
  const [form,setForm]=useState({name:'',phone:'',email:'',item:'',amount:'',method:'Mobile Money',notes:''});
  const [message,setMessage]=useState('');
  useEffect(()=>{getData('/boxes').then(data=>{setBoxes(data); if(data[0]) setForm(f=>({...f,item:data[0].name,amount:Number(data[0].price.replace(/,/g,''))}))})},[]);
  function selectBox(name){const b=boxes.find(x=>x.name===name);setForm(f=>({...f,item:name,amount:b?Number(b.price.replace(/,/g,'')):f.amount}))}
  async function submit(e){
    e.preventDefault(); setMessage('Saving order...');
    try{
      const {order}=await createOrder(form);
      await createPayment({orderId:order.id,amount:form.amount,method:form.method});
      setMessage(`Order #${order.id} saved and demo payment recorded.`);
      setForm({name:'',phone:'',email:'',item:boxes[0]?.name||'',amount:boxes[0]?Number(boxes[0].price.replace(/,/g,'')):'',method:'Mobile Money',notes:''});
    }catch(err){setMessage(err.message)}
  }
  return <section className="section pt-32 bg-linen min-h-screen"><div className="max-w-4xl mx-auto px-5">
    <SectionTitle eyebrow="Real order management" title={`Checkout & <em>Payment</em>`}>Create an order, record a demo payment, and send it to the admin dashboard.</SectionTitle>
    <form onSubmit={submit} className="card p-7 grid md:grid-cols-2 gap-5">
      <input className="input" placeholder="Customer name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
      <input className="input" placeholder="Phone number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required />
      <input className="input" type="email" placeholder="Email optional" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <select className="input" value={form.item} onChange={e=>selectBox(e.target.value)}>{boxes.map(b=><option key={b.id}>{b.name}</option>)}</select>
      <input className="input" type="number" placeholder="Amount RWF" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required />
      <select className="input" value={form.method} onChange={e=>setForm({...form,method:e.target.value})}><option>Mobile Money</option><option>Card Demo</option><option>Cash</option></select>
      <textarea className="input md:col-span-2" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}></textarea>
      <button className="btn-primary md:col-span-2">Submit order & record payment</button>
      {message && <p className="md:col-span-2 text-sm text-olive-dark">{message}</p>}
    </form>
  </div></section>
}
