export default function CustomerSupport() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Klantenservice</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contact Informatie</h2>
          <div className="space-y-4">
            <p>
              <strong>Email:</strong><br />
              <a href="mailto:info@pastoolz.nl" className="text-[#d6ac0a] hover:underline">
                info@pastoolz.nl
              </a>
            </p>
            <p>
              <strong>Adres:</strong><br />
              Schilderstraat 123<br />
              1234 AB Amsterdam
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Veelgestelde Vragen</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Wat zijn de levertijden?</h3>
              <p className="text-gray-600">
                Standaard levertijd is 2-3 werkdagen. Voor bestellingen boven €80 is verzending gratis.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Hoe kan ik mijn bestelling retourneren?</h3>
              <p className="text-gray-600">
                Binnen 14 dagen kunt u uw bestelling retourneren. Neem contact met ons op via email of telefoon.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Welke betaalmethoden worden geaccepteerd?</h3>
              <p className="text-gray-600">
                Momenteel accepteren we alleen iDEAL als betaalmethoden.
              </p>
            </div>
          </div>
        </div>
      </div>

  
    </div>
  );
} 