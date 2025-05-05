import * as Dialog from "@radix-ui/react-dialog";

export default function WaterDistributionDialog({
  open,
  onOpenChange,
  results,
  totalWater,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed z-50 bg-white p-6 rounded-lg shadow-xl top-[20%] left-[50%] -translate-x-1/2 w-[90%] max-w-3xl">
          <Dialog.Title className="text-xl font-bold mb-4">
            Water Distribution Results
          </Dialog.Title>
          <p className="mb-4">
            Total available river water per week:{" "}
            <strong>{totalWater} L</strong>
          </p>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {results.map((res, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <p>
                  <strong>Name:</strong> {res.name}
                </p>
                <p>
                  <strong>Crop:</strong> {res.crop}
                </p>
                <p>
                  <strong>Land Size:</strong> {res.landSize} ha
                </p>
                <p>
                  <strong>Water Needed:</strong> {res.weeklyNeed} L/week
                </p>
                <p>
                  <strong>Allocated Water:</strong> {res.allocatedWater} L/week
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Suggestion:</strong> {res.suggestion}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Dialog.Close className="bg-black text-white px-4 py-2 rounded-md">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
