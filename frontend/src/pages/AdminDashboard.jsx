import {useEffect,useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {addBox,deleteBox,getAdminBoxes,getAdminOrders,getAdminSummary,logout,sendEmail,updateBox,updateOrderStatus} from '../api';

const features = ['User login','Admin dashboard','Database','Payment system','Real order management','Email sending','Add/update/delete site items'];
const emptyBox = {name:'',price:'',serves:'2',items:'',image:''};

export default function AdminDashboard(){
  const navigate=useNavigate();
  const [summary,setSummary]=useState(null);
  const [orders,setOrders]=useState([]);
  const [boxes,setBoxes]=useState([]);
  const [boxForm,setBoxForm]=useState(emptyBox);
  const [editingId,setEditingId]=useState(null);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [email,setEmail]=useState({to:'customer@example.com',subject:'Steffi Metz update',body:'Hello from The Gourmet Shop!'});
  const [sent,setSent]=useState('');

  async function load(){
    try{
      const s=await getAdminSummary();
      const o=await getAdminOrders();
      const b=await getAdminBoxes();
      setSummary(s.summary); setOrders(o.orders); setBoxes(b.boxes);
    } catch(err){setError(err.message)}
  }
  useEffect(()=>{load()},[]);

  async function changeStatus(id,status){await updateOrderStatus(id,status); load();}
  async function handleEmail(e){e.preventDefault(); const r=await sendEmail(email); setSent(`Email saved as ${r.email.status}`)}
  function signOut(){logout(); navigate('/login')}

  function startEdit(box){
    setEditingId(box.id);
    setBoxForm({...box, items:(box.items || []).join(', ')});
    window.scrollTo({top:0,behavior:'smooth'});
  }
  async function submitBox(e){
    e.preventDefault(); setNotice('Saving item...');
    const payload={...boxForm, items:String(boxForm.items).split(',').map(i=>i.trim()).filter(Boolean)};
    try{
      if(editingId) await updateBox(editingId,payload); else await addBox(payload);
      setBoxForm(emptyBox); setEditingId(null); setNotice(editingId?'Item updated.':'Item added to site.');
      await load();
    }catch(err){setNotice(err.message)}
  }
  async function removeBox(id){
    if(!confirm('Delete this site item?')) return;
    await deleteBox(id); setNotice('Item deleted.'); load();
  }

  if(error) return <section className="section pt-32 min-h-screen bg-linen"><div className="max-w-xl mx-auto px-5 card p-7"><h1 className="heading">Admin <em>Access</em></h1><p className="text-bordeaux mt-4">{error}</p><Link className="btn-primary mt-6" to="/login">Go to login</Link></div></section>

  return <section className="section pt-32 min-h-screen bg-linen"><div className="max-w-7xl mx-auto px-5">
    <div className="flex flex-wrap justify-between gap-4 items-start mb-8">
      <div><div className="eyebrow">Backend features</div><h1 className="heading mt-3">Admin <em>Dashboard</em></h1></div>
      <button onClick={signOut} className="btn-primary">Logout</button>
    </div>

    <div className="card p-6 mb-8">
      <p className="text-stone-600 mb-4">Added backend modules:</p>
      <ul className="list-decimal ml-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-stone-700" dir="auto">
        {features.map((f,i)=><li key={f} value={i+1}>{f}</li>)}
      </ul><br />
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      {summary && Object.entries(summary).map(([k,v])=><div key={k} className="card p-5"><p className="text-xs uppercase tracking-widest text-stone-500">{k}</p><b className="font-serif text-3xl text-olive-dark">{typeof v==='number'?v.toLocaleString():v}</b></div>)}
    </div>

    <div className="grid lg:grid-cols-[1fr_1.4fr] gap-7 mb-8">
      <form onSubmit={submitBox} className="card p-6 grid gap-4 content-start">
        <h2 className="font-serif text-3xl text-olive-dark">{editingId?'Update Site Item':'Add Site Item'}</h2>
        <p className="text-sm text-stone-600">Add gourmet boxes/products here. They are saved in the backend database and shown on the Boxes page.</p>
        <input className="input" value={boxForm.name} onChange={e=>setBoxForm({...boxForm,name:e.target.value})} placeholder="Item name" required />
        <input className="input" value={boxForm.price} onChange={e=>setBoxForm({...boxForm,price:e.target.value})} placeholder="Price e.g. 52,000" required />
        <input className="input" value={boxForm.serves} onChange={e=>setBoxForm({...boxForm,serves:e.target.value})} placeholder="Serves e.g. 2" />
        <textarea className="input" rows="4" value={boxForm.items} onChange={e=>setBoxForm({...boxForm,items:e.target.value})} placeholder="Items separated by commas" />
        <input className="input" value={boxForm.image || ''} onChange={e=>setBoxForm({...boxForm,image:e.target.value})} placeholder="Image URL optional" />
        <button className="btn-primary">{editingId?'Update item':'Add item'}</button>
        {editingId && <button type="button" className="btn border border-bordeaux text-bordeaux" onClick={()=>{setEditingId(null);setBoxForm(emptyBox)}}>Cancel edit</button>}
        {notice && <p className="text-sm text-olive-dark">{notice}</p>}
      </form>

      <div className="card p-6 overflow-x-auto">
        <h2 className="font-serif text-3xl text-olive-dark mb-4">Site Items</h2>
        <table className="w-full text-sm"><thead><tr className="text-left text-stone-500"><th className="py-2">Name</th><th>Price</th><th>Serves</th><th>Actions</th></tr></thead><tbody>
          {boxes.map(b=><tr key={b.id} className="border-t border-olive/10"><td className="py-3">{b.name}<br/><span className="text-xs text-stone-500">{(b.items||[]).slice(0,3).join(', ')}</span></td><td>{b.price} RWF</td><td>{b.serves}</td><td className="flex gap-2 py-3"><button className="text-bordeaux underline" onClick={()=>startEdit(b)}>Edit</button><button className="text-stone-500 underline" onClick={()=>removeBox(b.id)}>Delete</button></td></tr>)}
        </tbody></table>
      </div>
    </div>

    <div className="grid lg:grid-cols-[2fr_1fr] gap-7">
      <div className="card p-6 overflow-x-auto">
        <h2 className="font-serif text-3xl text-olive-dark mb-4">Orders</h2>
        <table className="w-full text-sm"><thead><tr className="text-left text-stone-500"><th className="py-2">ID</th><th>Customer</th><th>Item</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead><tbody>
          {orders.map(o=><tr key={o.id} className="border-t border-olive/10"><td className="py-3">#{o.id}</td><td>{o.name}<br/><span className="text-xs text-stone-500">{o.phone}</span></td><td>{o.item}</td><td>{o.paymentStatus}</td><td>{o.status}</td><td><select className="input !py-2" value={o.status} onChange={e=>changeStatus(o.id,e.target.value)}><option>pending</option><option>preparing</option><option>ready</option><option>delivered</option><option>cancelled</option></select></td></tr>)}
          {!orders.length && <tr><td colSpan="6" className="py-8 text-center text-stone-500">No orders yet. Create one from checkout.</td></tr>}
        </tbody></table>
      </div>

      <form onSubmit={handleEmail} className="card p-6 grid gap-4 content-start">
        <h2 className="font-serif text-3xl text-olive-dark">Send Email</h2>
        <input className="input" value={email.to} onChange={e=>setEmail({...email,to:e.target.value})} placeholder="To" />
        <input className="input" value={email.subject} onChange={e=>setEmail({...email,subject:e.target.value})} placeholder="Subject" />
        <textarea className="input" value={email.body} onChange={e=>setEmail({...email,body:e.target.value})} placeholder="Message" rows="5" />
        <button className="btn-primary">Send demo email</button>
        {sent && <p className="text-sm text-olive-dark">{sent}</p>}
      </form>
    </div>
  </div></section>
}
