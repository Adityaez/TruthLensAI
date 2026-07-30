import { useParams, Link } from "react-router-dom";
import { useAnalysis } from "../store/analysisStore.jsx";

export default function Result() {
  const { id } = useParams();
  const { getResult } = useAnalysis();
  const result = getResult(id);

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-400 mb-4">No Analysis Found</h1>
        <p className="text-gray-400 mb-8">
          No analysis result for ID: {id}
        </p>
        <Link
          to="/upload"
          className="gradient-btn px-6 py-3 rounded-xl font-semibold"
        >
          Upload Media
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold gradient-text mb-4">Analysis Result</h1>
      <p className="text-gray-400 mb-8">Coming Soon — Full Result Page</p>
      <p className="text-gray-500">Result ID: {id}</p>
      <Link to="/upload" className="text-purple-400 hover:text-purple-300 underline mt-4">
        ← Analyze Another
      </Link>
    </div>
  );
}
