import { useEffect, useState } from "react";
import { Card, CardContent } from "../Components/ui/card";

function InterviewList() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/interviews")
      .then((res) => res.json())
      .then((data) => {
        setInterviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch interviews", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading interviews...</p>;
  if (interviews.length === 0) return <p>No interviews scheduled yet.</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Scheduled Interviews</h2>
      <div className="space-y-4">
        {interviews.map((iv) => (
          <Card key={iv.id} className="p-4">
            <CardContent>
              <p><strong>Candidate Link ID:</strong> {iv.link_id}</p>
              <p><strong>Type:</strong> {iv.type}</p>
              <p><strong>Interviewer:</strong> {iv.interviewer}</p>
              <p><strong>Scheduled At:</strong> {new Date(iv.scheduled_at).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default InterviewList;
