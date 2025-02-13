import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import PropTypes from "prop-types";

const testimonialList = [
	{
		color: "red",
		author: {
			fullName: "Akshay Kumar",
			picture: "https://cdn.easyfrontend.com/pictures/users/user3.jpg",
			designation: "Founder / CEO",
		},
		rating: 3.5,
		description:
			"Assumenda non repellendus distinctio nihil dicta sapiente, quibusdam maiores, illum at, aliquid blanditiis eligendi qui.",
	},
	{
		color: "blue",
		author: {
			fullName: "Raima Sen",
			picture: "https://cdn.easyfrontend.com/pictures/users/user25.jpg",
			designation: "Founder / CEO",
		},
		rating: 3.5,
		description:
			"Assumenda non repellendus distinctio nihil dicta sapiente, quibusdam maiores, illum at, aliquid blanditiis eligendi qui.",
	},
	{
		color: "yellow",
		author: {
			fullName: "Arjun Kapur",
			picture: "https://cdn.easyfrontend.com/pictures/users/user11.jpg",
			designation: "Founder / CEO",
		},
		rating: 3.5,
		description:
			"Assumenda non repellendus distinctio nihil dicta sapiente, quibusdam maiores, illum at, aliquid blanditiis eligendi qui.",
	},
];

const Rating = ({ rating, showLabel, className, ...rest }) => (
	<p className={classNames("mb-6", className)} {...rest}>
		<span>
			{[...Array(5)].map((_, i) => {
				const index = i + 1;
				let content = "";
				if (index <= Math.floor(rating))
					content = (
						<FontAwesomeIcon icon={faStar} className="text-yellow-500" />
					);
				else if (rating > i && rating < index + 1)
					content = (
						<FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500" />
					);
				else if (index > rating)
					content = (
						<FontAwesomeIcon
							icon={faStar}
							className="text-yellow-200 dark:text-opacity-20"
						/>
					);

				return <Fragment key={i}>{content}</Fragment>;
			})}
		</span>
		{showLabel && <span>{rating.toFixed(1)}</span>}
	</p>
);

Rating.propTypes = {
	rating: PropTypes.number.isRequired,
	showLabel: PropTypes.bool,
	className: PropTypes.string,
};

const TestimonialItem = ({ testimonial }) => (
	<div className="bg-white  shadow-xl  rounded-2xl transition duration-300 h-full relative p-6 lg:p-0">
		<div
			className={`bg-${testimonial.color}-400 w-24 h-24 rounded-full text-3xl inline-flex justify-center items-center -mt-12 overflow-hidden`}
		>
			<img
				src={testimonial.author.picture}
				alt={testimonial.author.fullName}
				className=" max-w-full h-auto rounded-full w-full p-1"
			/>
		</div>
		<div className="lg:px-6 pt-6 lg:pb-12">
			<div className="ml-6 pl-20 lg:ml-6 lg:pl-12">
				<h4 className="text-xl font-medium mb-1 -mt-12">
					{testimonial.author.fullName}
				</h4>

				<Rating rating={testimonial.rating} showLabel={false} />
			</div>
			<p className="opacity-80">{testimonial.description}</p>
		</div>
	</div>
);

TestimonialItem.propTypes = {
	testimonial: PropTypes.object.isRequired,
};

const Testimonial2 = () => {
	return (
		<section className="ezy__testimonial2 light py-14 md:py-24   text-zinc-900 max-w-[80vw] flex justify-center items-center mx-auto">
			<div className="container px-4 mx-auto">
				<div className="flex justify-center md:mb-6">
					<div className="sm:max-w-lg text-center">
						<h2 className="font-semibold text-3xl mb-6">
							COMMUNITY REVIEWS
						</h2>
						<p className="font-light">
							It’s easier to reach your savings goals when you have the right
							savings account. Take a look and find the right one for you!
						</p>
					</div>
				</div>

				<div className="grid grid-cols-6 gap-6 gap-y-12 pt-20">
					{testimonialList.map((testimonial, i) => (
						<div className="col-span-6 lg:col-span-2" key={i}>
							<TestimonialItem testimonial={testimonial} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonial2;