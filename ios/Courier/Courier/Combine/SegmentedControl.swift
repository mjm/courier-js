//
//  SegmentedControl.swift
//  Courier
//
//  Created by Matt Moriarity on 11/14/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import UIKit

extension UISegmentedControl {
    var selectionDidChange: AnyPublisher<Int, Never> {
        valueDidChange
            .map { control, _ in control.selectedSegmentIndex }
            .eraseToAnyPublisher()
    }
}
