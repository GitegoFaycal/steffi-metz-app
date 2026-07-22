const features = ['User login','Admin dashboard','Database','Payment system','Real order management','Email sending','Add/update/delete site items'];
export default function BackendFeatures(){
  return <section className="section bg-linen"><div className="max-w-5xl mx-auto px-5">
    <div className="eyebrow">Full-stack features</div>
    <h2 className="heading mt-3">Backend <em>Modules Added</em></h2>
    <div className="card p-7 mt-8">
      <ul className="list-decimal ml-6 grid sm:grid-cols-2 gap-3 text-stone-700" dir="auto">
        {features.map((feature,index)=><li key={feature} value={index+1}>{feature}</li>)}
      </ul><br />
    </div>
  </div></section>
}
