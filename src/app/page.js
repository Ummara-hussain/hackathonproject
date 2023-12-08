import Image from 'next/image'
import Link from 'next/link'


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <Link href="/login">login</Link> */}
      <div >
      <div >
        <h2 style={{ fontSize: 'xx-large', fontWeight: 'bolder', margin: '20px', textAlign: 'center' }}>
          Welcome!
        </h2>
     <p>Sign up or log in to continue </p>
      </div>

      <div style={{width:'30%',margin:'auto', lineHeight:'2'}} >

        <div style={{ border: '1px solid deeppink', width: '70px', margin:'20px',textAlign:"center" }} >
          <Link href="/login">Log in</Link>
        </div>
        <div style={{ border: '1px solid deeppink', width: '70px',margin:'20px',textAlign:"center" }} >
          <Link href="/register">Sign up</Link>
        </div>


      </div>
      </div>
          </main>
  )
}
