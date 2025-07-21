
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-secondary/50 hover:border-white/20 hover:shadow-xl hover:shadow-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-secondary/50 hover:border-white/20 hover:shadow-xl hover:shadow-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Subscriptions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-secondary/50 hover:border-white/20 hover:shadow-xl hover:shadow-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 backdrop-blur-lg border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-secondary/50 hover:border-white/20 hover:shadow-xl hover:shadow-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Active Now
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-secondary/30 backdrop-blur-lg border-white/10 col-span-1 lg:col-span-2 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-secondary/50 hover:border-white/20 hover:shadow-xl hover:shadow-accent/10">
        <CardHeader>
            <CardTitle className="text-primary">Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">This is your central hub for managing the CyberLim website. From here, you can manage projects, view analytics, and update content. Use the sidebar to navigate through the different sections.</p>
        </CardContent>
      </Card>
    </div>
  );
}
