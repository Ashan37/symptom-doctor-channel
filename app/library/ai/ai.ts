export async function analyzeSymptoms({title, description}:{ title?: string; description: string }){
     return{
        conditions: [
            {name: 'Tension Headache', probability: 0.75},
            {name: 'Migraine', probability: 0.15},
            {name: 'Cluster Headache', probability: 0.10}
        ],
        urgency: 'MEDIUM',
        recommendations: ['Hydration', 'Rest in a quiet, dark room', 'Over-the-counter pain relievers']
     }
}