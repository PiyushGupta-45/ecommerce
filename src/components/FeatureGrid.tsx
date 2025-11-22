const features = [
  { title: 'One-tap checkout', detail: 'Secure payments with instant confirmation.' },
  { title: 'Live order tracking', detail: 'Track every milestone right from your dashboard.' },
  { title: 'Personalized picks', detail: 'Smart recommendations tailored to your taste.' },
  { title: 'Premium support', detail: 'Dedicated stylists and gear experts 24/7.' },
]

export function FeatureGrid() {
  return (
    <section className="feature-grid">
      {features.map((feature) => (
        <article key={feature.title}>
          <h4>{feature.title}</h4>
          <p>{feature.detail}</p>
        </article>
      ))}
    </section>
  )
}

