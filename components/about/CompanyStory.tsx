export default function CompanyStory() {
  const milestones = [
    {
      year: "2016",
      title: "Founded in GRA Phase 2",
      description:
        "Meridian Properties was established by a team of experienced estate surveyors determined to bring transparency to Port Harcourt's property market.",
    },
    {
      year: "2018",
      title: "NIESV Affiliation",
      description:
        "Became an affiliated member of the Nigerian Institution of Estate Surveyors and Valuers, cementing our commitment to professional standards.",
    },
    {
      year: "2020",
      title: "Diaspora Programme Launch",
      description:
        "Launched our dedicated diaspora buyer programme, providing UK, US and Canada-based Nigerians with verified, escrow-protected property purchases.",
    },
    {
      year: "2023",
      title: "200+ Successful Transactions",
      description:
        "Crossed 200 successfully closed transactions — sales, lettings, and short-let management — across GRA, Woji, Eliozu, Ada George and Trans-Amadi.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Story Text */}
          <div>
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2">
              Our Story
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Built on Transparency in a Market Full of Noise
            </h2>
            <div className="flex flex-col gap-4 text-slate-600 leading-relaxed">
              <p>
                When we founded Meridian Properties in 2016, Port
                Harcourt&apos;s property market was — and still is — filled with
                agents who hide fees, show properties they do not have mandates
                for, and make promises they cannot keep.
              </p>
              <p>
                We built Meridian around a different belief: that a buyer should
                know exactly what title document a property has before they
                spend a single naira on inspection fees. That a tenant should
                see the full move-in cost — rent, agency fee, legal fee, and
                caution deposit — before they ever visit a property.
              </p>
              <p>
                Eight years later, that belief has driven over 200 successful
                transactions and a client base that refers us to family members,
                colleagues, and diaspora friends without hesitation.
              </p>
              <p>
                We are not the biggest agency in Port Harcourt. We are the most
                honest one — and in this market, that is what keeps clients
                coming back.
              </p>
            </div>
          </div>

          {/* Milestones */}
          <div className="flex flex-col gap-0">
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-6">
              Our Journey
            </p>
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {milestone.year.slice(2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 bg-slate-200 flex-1 my-1" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <p className="text-xs text-slate-400 mb-0.5">
                    {milestone.year}
                  </p>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
