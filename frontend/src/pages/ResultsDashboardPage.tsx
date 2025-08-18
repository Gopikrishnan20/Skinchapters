
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp, AlertTriangle, ThumbsUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResultsDashboardPage = () => {
  // Sample data for charts
  const skinScoreData = [
    { date: 'Jan 1', score: 68 },
    { date: 'Jan 15', score: 72 },
    { date: 'Feb 1', score: 76 },
    { date: 'Feb 15', score: 81 },
    { date: 'Mar 1', score: 84 },
    { date: 'Mar 15', score: 87 },
  ];

  const skinConditionsData = [
    { name: 'Acne', value: 20 },
    { name: 'Dryness', value: 30 },
    { name: 'Dullness', value: 25 },
    { name: 'Redness', value: 15 },
    { name: 'Other', value: 10 },
  ];

  const chapterProgressData = [
    { chapter: 'Ch 1: Hydration', progress: 100 },
    { chapter: 'Ch 2: Repair', progress: 80 },
    { chapter: 'Ch 3: Protection', progress: 40 },
    { chapter: 'Ch 4: Maintenance', progress: 0 },
    { chapter: 'Ch 5: Brightening', progress: 0 },
  ];

  const COLORS = ['#9b87f5', '#FEC6A1', '#D1F0B1', '#E5DEFF', '#B3D58C'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Skin Dashboard</h1>
              <p className="text-muted-foreground">Track your progress and see your skin's improvement over time</p>
            </div>
            <Button asChild>
              <Link to="/scan">
                New Skin Analysis
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Current Skin Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-skin-purple">87</div>
                  <div className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+5 since last scan</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Current Chapter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold">Chapter 3: Protection</div>
                  <div className="text-sm text-muted-foreground">Week 3 of 8</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Next Scan Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold">April 15, 2025</div>
                  <div className="text-sm text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">In 3 days</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Latest Skin Analysis</CardTitle>
                  <CardDescription>From your scan on March 15, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-skin-purple-light mb-4">
                        <img 
                          src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&h=300&auto=format&fit=crop"
                          alt="Your face analysis" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center mb-4">
                        <span className="text-sm font-medium text-muted-foreground">Your Skin Type</span>
                        <p className="text-lg font-semibold">Combination</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Detected Conditions</h3>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-skin-purple"></span>
                            <span>Mild redness around nose</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-skin-peach"></span>
                            <span>T-zone oiliness</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-skin-green"></span>
                            <span>Slight dehydration</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Improvement Areas</h3>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            <span>Acne reduced by 70%</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span>Hydration improved by 40%</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span>UV damage needs attention</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-3">Recommended Next Chapter</h3>
                    <div className="bg-gradient-to-r from-skin-green-light to-skin-green/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Chapter 4: Maintenance</h4>
                          <p className="text-sm">Ready to begin in 5 weeks</p>
                        </div>
                        <Button asChild variant="outline" className="bg-white/80 hover:bg-white">
                          <Link to="/chapters/4">
                            Preview
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Chapter Progress</CardTitle>
                <CardDescription>Your journey so far</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={chapterProgressData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="chapter" type="category" width={100} />
                      <Tooltip 
                        formatter={(value) => [`${value}% completed`, 'Progress']}
                      />
                      <Bar dataKey="progress" fill="#9b87f5" radius={[0, 4, 4, 0]}>
                        {chapterProgressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 text-center">
                  <Button asChild variant="outline">
                    <Link to="/chapters">
                      View All Chapters
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="progress">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="progress" className="pt-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Skin Score History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={skinScoreData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#9b87f5" activeDot={{ r: 8 }} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analysis" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Skin Conditions Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={skinConditionsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {skinConditionsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Improvements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">+</div>
                        <div>
                          <p className="font-medium">Hydration increased by 27%</p>
                          <p className="text-sm text-muted-foreground">Since starting Chapter 1</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">+</div>
                        <div>
                          <p className="font-medium">Skin brightness improved by 15%</p>
                          <p className="text-sm text-muted-foreground">Last 30 days</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">+</div>
                        <div>
                          <p className="font-medium">Acne reduced by 40%</p>
                          <p className="text-sm text-muted-foreground">Since first scan</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">!</div>
                        <div>
                          <p className="font-medium">Sensitivity still present</p>
                          <p className="text-sm text-muted-foreground">Consider adding calming products</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultsDashboardPage;
