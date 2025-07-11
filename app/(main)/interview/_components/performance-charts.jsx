"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">Performance Trend</CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1">
                <Tooltip content={`${data.score}%`}>
                  <div className="text-xs font-semibold text-muted-foreground">{data.date}</div>
                  <Progress value={data.score} max={100} />
                </Tooltip>
              </div>
              <div className="w-16 text-right text-lg font-bold">{data.score}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
