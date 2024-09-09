export default function Container ({children}:
    {children: React.ReactNode}
){
    return(
       <div id="container" className="max-w-[1000px] min-w-[400px] overflow-auto mx-auto  h-[100svh] border-[1px] border-zinc-900 rounded-2xl flex flex-col">
{children}
       </div>
    )
}