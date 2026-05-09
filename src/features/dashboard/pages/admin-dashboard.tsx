import { motion } from 'framer-motion'
import { Users, Activity, TrendingUp, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/features/auth/store/auth-store'
import { StatCard } from '@/shared/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card'
import { format } from 'date-fns'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as const } },
}

export function AdminDashboard() {
  const { user } = useAuth()

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants}>
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-zinc-500 mt-1">
          Welcome back, {user?.name?.split(' ')[0]}. Today is {format(new Date(), 'EEEE, MMMM d, yyyy')}.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="—" icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" index={0} />
        <StatCard title="Active Today" value="—" icon={Activity} iconBg="bg-emerald-50" iconColor="text-emerald-600" index={1} />
        <StatCard title="Growth" value="—" icon={TrendingUp} iconBg="bg-violet-50" iconColor="text-violet-500" index={2} />
        <StatCard title="Completed" value="—" icon={CheckCircle2} iconBg="bg-amber-50" iconColor="text-amber-500" index={3} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              This is your admin dashboard. Replace this placeholder with your project's overview widgets,
              charts, and key metrics. Stat cards, tables, and chart components are ready to use in
              <code className="mx-1 px-1.5 py-0.5 rounded bg-zinc-100 text-[12px] text-zinc-700">src/components/ui</code>.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
