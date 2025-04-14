import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentDocuments } from "@/components/dashboard/recent-documents";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Total Documents</CardTitle>
            <CardDescription>Your document storage usage</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold">27</CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Encrypted Files</CardTitle>
            <CardDescription>Files with encryption enabled</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold">12</CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Storage Used</CardTitle>
            <CardDescription>Total storage consumption</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold">156 MB</CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upload Activity</CardTitle>
            <CardDescription>Document upload trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest document actions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Recently uploaded and modified documents</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentDocuments />
        </CardContent>
      </Card>
    </div>
  );
}