import { UserDashboardBento } from '@/components/custom/UserDashboardBento'
import { UserProfileCard } from '@/components/custom/UserProfileCard'


const page = () => {
  return (
    <main className="flex min-h-[90dvh] w-full items-center justify-center">
  <section className="flex flex-row w-full max-w-7xl px-5"> 
    <div className="basis-1/3 p-2">
      <UserProfileCard />
    </div>
    <div className="basis-2/3 p-2">
      <UserDashboardBento />
    </div>
  </section>
</main>
  )
}

export default page