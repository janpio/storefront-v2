

type OrderButtonProps = {
    onSubmit: () => void;
    onClear: () => void;
    isOrderValid: boolean;
};

export default function OrderButtons({ onSubmit, onClear, isOrderValid }: OrderButtonProps) {

    return (
        <div className="grid grid-cols-2 gap-4 md:gap-12 lg:gap-20">
            <button onClick={onClear}
                className="w-24 p-4 h-12 flex justify-center items-center rounded-md bg-blue-300 hover:bg-violet-600 md:w-28 lg:w-32">
                Clear
            </button>
            <button onClick={onSubmit}
                disabled={!isOrderValid}
                className="w-24 p-4 h-12 flex justify-center items-center rounded-md bg-blue-300 hover:bg-violet-600 md:w-28 lg:w-32">
                Submit
            </button>
        </div>
    )
}